from typing import List, Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from agents import Runner

from .agent import (
    plot_explicit_function,
    plot_parametric_function,
    plot_planar_function,
    agent,
    session,
)

app = FastAPI(title="Mobius Backend API", version="0.1.0")


class ExplicitFunctionRequest(BaseModel):
    expression: str
    x_range: List[float] = Field(default_factory=lambda: [-10.0, 10.0])
    y_range: List[float] = Field(default_factory=lambda: [-10.0, 10.0])


class ParametricFunctionRequest(BaseModel):
    x_expr: str
    y_expr: str
    t_range: List[float] = Field(default_factory=lambda: [0.0, 10.0])


class PlanarFunctionRequest(BaseModel):
    a: float
    b: float
    c: float
    d: float
    x_range: List[float] = Field(default_factory=lambda: [-10.0, 10.0])
    y_range: List[float] = Field(default_factory=lambda: [-10.0, 10.0])


class UserInputRequest(BaseModel):
    message: str


latest_llm_text: Optional[str] = None


@app.get("/")
async def read_healthcheck():
    return {"status": "ok"}


@app.post("/plot/explicit")
async def plot_explicit_surface(payload: ExplicitFunctionRequest):
    return plot_explicit_function(
        expression=payload.expression,
        x_range=list(payload.x_range),
        y_range=list(payload.y_range),
    )


@app.post("/plot/parametric")
async def plot_parametric_curve(payload: ParametricFunctionRequest):
    return plot_parametric_function(
        x_expr=payload.x_expr,
        y_expr=payload.y_expr,
        t_range=list(payload.t_range),
    )


@app.post("/plot/planar")
async def plot_planar_surface(payload: PlanarFunctionRequest):
    return plot_planar_function(
        a=payload.a,
        b=payload.b,
        c=payload.c,
        d=payload.d,
        x_range=list(payload.x_range),
        y_range=list(payload.y_range),
    )


@app.post("/conversation/user-input")
async def receive_user_input(payload: UserInputRequest):
    global latest_llm_text

    result = Runner.run_sync(agent, input=payload.message, session=session)

    if not hasattr(result, "final_output"):
        raise HTTPException(status_code=500, detail="Agent returned no output.")

    latest_llm_text = result.final_output
    return {"response": result.final_output}


@app.get("/conversation/llm-text")
async def send_llm_text():
    if latest_llm_text is None:
        raise HTTPException(status_code=404, detail="No LLM output available.")
    return {"text": latest_llm_text}
