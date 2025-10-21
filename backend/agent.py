import os
import time
import uuid
from collections import deque
from typing import Any, Dict, List

from agents import Agent, Runner, function_tool, SQLiteSession
from dotenv import load_dotenv

def start_session():
    session_id = str(uuid.uuid4())
    return session_id


@function_tool
def plot_explicit_function(
    expression: str,
    x_range: List[float] = [-10.0, 10.0],
    y_range: List[float] = [-10.0, 10.0],
):
    """Render explicit surface z=f(x,y). `expression` must be math.js-compatible RHS."""
    print(f"Plotting explicit function: {expression} over x:{x_range}, y:{y_range}")
    result = {"ok": True, "type": "explicit_surface", "expr": expression,
            "x_range": x_range, "y_range": y_range}
    _record_tool_event("plot_explicit_function", result)
    return result

@function_tool
def plot_parametric_function(
    x_expr: str,
    y_expr: str,
    t_range: List[float] = [0.0, 10.0],
):
    """Render 2D parametric curve (x(t), y(t))."""
    print(f"Plotting parametric function: {x_expr}, {y_expr} over t:{t_range}")
    result = {"ok": True, "type": "parametric_curve", "x_expr": x_expr,
            "y_expr": y_expr, "t_range": t_range}
    _record_tool_event("plot_parametric_function", result)
    return result

@function_tool
def plot_planar_function(
    a: float, b: float, c: float, d: float,
    x_range: List[float] = [-10.0, 10.0],
    y_range: List[float] = [-10.0, 10.0],
):
    """Render plane ax + by + cz + d = 0 (frontend converts to z)."""
    print(f"Plotting planar function: {a}, {b}, {c}, {d} over x:{x_range}, y:{y_range}")
    result = {"ok": True, "type": "plane", "a": a, "b": b, "c": c, "d": d,
            "x_range": x_range, "y_range": y_range}
    _record_tool_event("plot_planar_function", result)
    return result


@function_tool
def plot_inequality_region(
    expression: str,
    operator: str = ">=",
    x_range: List[float] = [-3.1416, 3.1416],
    y_range: List[float] = [-3.1416, 3.1416],
    z_range: List[float] = [-3.1416, 3.1416],
):
    """
    Render a 3D inequality region defined by z (operator) f(x, y).
    expression should be math.js compatible and evaluate to f(x, y).
    operator must be one of ">=" or ">" (inclusive vs strict region).
    """
    normalized_operator = operator.strip()
    if normalized_operator not in {">=", ">"}:
        raise ValueError(
            f"Unsupported inequality operator '{operator}'. Use '>=' or '>'."
        )

    def _coerce_range(name: str, raw: List[float]) -> List[float]:
        if not isinstance(raw, list) or len(raw) != 2:
            raise ValueError(f"{name} must be a list of two numbers.")
        start, end = raw
        if not isinstance(start, (int, float)) or not isinstance(end, (int, float)):
            raise ValueError(f"{name} values must be numeric.")
        if start == end:
            end = start + 1.0
        return [float(start), float(end)]

    safe_x_range = _coerce_range("x_range", x_range)
    safe_y_range = _coerce_range("y_range", y_range)
    safe_z_range = _coerce_range("z_range", z_range)

    print(
        "Plotting inequality region:",
        expression,
        normalized_operator,
        "x:",
        safe_x_range,
        "y:",
        safe_y_range,
        "z:",
        safe_z_range,
    )

    result = {
        "ok": True,
        "type": "inequality_region",
        "expression": expression,
        "operator": normalized_operator,
        "x_range": safe_x_range,
        "y_range": safe_y_range,
        "z_range": safe_z_range,
    }
    _record_tool_event("plot_inequality_region", result)
    return result



load_dotenv()
os.getenv("OPENAI_API_KEY")
_tool_event_buffer: deque[Dict[str, Any]] = deque(maxlen=128)

def _record_tool_event(tool_name: str, payload: Dict[str, Any]) -> None:
    _tool_event_buffer.append({
        "id": str(uuid.uuid4()),
        "tool": tool_name,
        "payload": payload,
        "timestamp": time.time(),
    })

def consume_tool_events() -> List[Dict[str, Any]]:
    events = list(_tool_event_buffer)
    _tool_event_buffer.clear()
    return events

agent = Agent(name="Math Assistant", 
              instructions="""
              You are an assistant that helps people understand complex mathematical concepts and draw graphs to illustrate them.
              You can draw parametric, planar and explicit functions in both 2D and 3D.
              When given a mathematical question, always respond with a graph to illustrate your explanation where possible. 
              Wherever there is a graphable function involved, use the plotting tools to generate a plot.
              Output all equations in valid LATEX format between dollar signs ($...$).
              When you use the tool for plotting, always use explicit surface form z = f(x, y) (one z value for every x,y).
              Input only the right-hand side of the equation as a valid math.js expression — e.g. sin(sqrt(x^2 + y^2)), x^2 - y^2, sqrt(r^2 - x^2 - y^2) etc.

              Use * for multiplication (2*x, not 2x).

              Use standard math.js function names: sin, cos, tan, sqrt, log, exp, abs, pow(a,b).

              Never use assignment (=), only the expression itself.

              Never include semicolons or text.

              Optional constants can be given in lowercase (e.g. r, a).

              Your input to the tool will be compiled directly with math.compile(expr) inside JavaScript.

              To plot 3D inequality regions of the form z >= f(x, y) or z > f(x, y), call plot_inequality_region with:
              - expression: the math.js-compatible f(x, y) on the right-hand side.
              - operator: ">=" for inclusive regions (show the boundary) or ">" for strict regions (show region only).
              - Optional x_range, y_range, z_range lists [min, max] to focus on a specific box. Defaults cover approximately [-pi, pi].
              Flip inequalities such as z <= f(x, y) into -z >= -f(x, y) so they match the expected operator.
              """,
              tools=[plot_explicit_function, plot_parametric_function, plot_planar_function, plot_inequality_region])

session = SQLiteSession(session_id=start_session())


def main():
    while True:
        user_input = input("User: ")
        result = Runner.run_sync(agent, input=user_input, session=session)
        print("Agent:", result.final_output)


if __name__ == "__main__":
    main()
