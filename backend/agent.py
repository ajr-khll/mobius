import os
import time
import uuid
from collections import deque
from typing import Any, Dict, List

from agents import Agent, Runner, function_tool, SQLiteSession
from dotenv import load_dotenv

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
              When given a mathematical concept, if appropriate, generate a graph to illustrate it using the available tool.
              Output all equations in valid LATEX format between dollar signs ($...$).
              When you use the tool for plotting, always use explicit surface form z = f(x, y) (one z value for every x,y).
              Input only the right-hand side of the equation as a valid math.js expression — e.g. sin(sqrt(x^2 + y^2)), x^2 - y^2, sqrt(r^2 - x^2 - y^2) etc.

              Use * for multiplication (2*x, not 2x).

              Use standard math.js function names: sin, cos, tan, sqrt, log, exp, abs, pow(a,b).

              Never use assignment (=), only the expression itself.

              Never include semicolons or text.

              Optional constants can be given in lowercase (e.g. r, a).

              Your input to the tool will be compiled directly with math.compile(expr) inside JavaScript.
              """,
              tools=[plot_explicit_function, plot_parametric_function, plot_planar_function])

session = SQLiteSession("conversation_123")


def main():
    while True:
        user_input = input("User: ")
        result = Runner.run_sync(agent, input=user_input, session=session)
        print("Agent:", result.final_output)


if __name__ == "__main__":
    main()
