## Live Link To Try: https://mobius-pearl.vercel.app/

## Project Title: Mobius: AI-Powered 3D Mathematical Visualization
**Team Members:** Akshay Vadlamani, AJ (Arjun) Khullar, Anika Mantripragada
## Summary

**The Problem:**

Many students rely on LLMs to assist them through challenging mathematics courses by providing step-by-step solutions. However, LLMs fall short in their inability to help students visualize the necessary functions that aid in comprehension of said problems. Existing tools like Desmos and Wolfram Alpha only offer 2D visualizations with cumbersome input formats, making it difficult for students to understand multivariable calculus, vector fields, and parametric surfaces.

**The Solution:**

Mobius revolutionizes how students approach mathematics by providing Large Language Models with a framework that supports LLMs' existing solutions with interactive 3D visual aids. This allows students to break through the layers of abstraction that can make high-level calculus feel so overwhelming, ensuring a deeper understanding rooted in geometry.
Students can ask Mobius to visualize any 3D function, parametric equation, or surface in real-time while working through problems. The AI renders the geometry instantly, allowing users to rotate, modify parameters, and explore the mathematical concepts visually.

## How AI is Used:

Mobius integrates AI in the following ways:

1. OpenAI Agents SDK: We use the OpenAI Agents SDK to allow the LLM to configure and modify displayed graphs through custom function tools designed specifically for mathematical visualization.

2. Natural Language Interface: Users interact with Mobius through conversational AI, asking questions and requesting visualizations in plain English rather than learning complex graphing syntax.

3. Real-Time Graph Configuration: The AI agent interprets mathematical expressions and automatically configures Plotly's WebGL-based rendering engine to display accurate 3D visualizations.

4. LaTeX Parsing: All mathematical equations are automatically parsed and rendered in LaTeX format for clear, professional presentation.

**Capabilities:**

1. Visualize parametric equations, 2D functions, and 3D surfaces

2. Real-time parameter modification and exploration

3. Full ChatGPT math assistant with visual enhancement
4. Render semi-transparent 3D inequality regions (e.g. visualize where z >= f(x, y)) with strict vs inclusive boundary styling
5. Interactive rotation and manipulation


**Use Cases:**

**Students:** Build geometric intuition while doing homework and exam prep

**Professors:** Create interactive lectures with instant 3D demonstrations

**Researchers:** Rapidly prototype complex models through conversation



