# Some code stuff when bored
## Good old BFS, DFS abd A*
- Some python code for bfs and dfs with some details on which one is good which not
- some visualisations
- lets run it in animations so we can visulaise how it works


# Pathfinding Visualizer

This project visualizes Breadth-First Search (BFS), Depth-First Search (DFS), and A* Search algorithms on a grid. It includes both a Jupyter Notebook for analysis and a web-based interactive visualizer.

## Setup Instructions

Follow these steps to set up a virtual environment and run the project.

### 1. Create a Virtual Environment

It's recommended to use a virtual environment to keep dependencies isolated.

**macOS / Linux:**
```bash
python3 -m venv venv
```

**Windows:**
```bash
python -m venv venv
```

### 2. Activate the Virtual Environment

**macOS / Linux:**
```bash
source venv/bin/activate
```

**Windows:**
```bash
.\venv\Scripts\activate
```

### 3. Install Dependencies

Once the virtual environment is active, install the required packages using the `requirements.txt` file:

```bash
pip install -r requirements.txt
```

## Running the Project

### Jupyter Notebook
To explore the algorithms and Python implementation details:

1.  Start Jupyter Notebook:
    ```bash
    jupyter notebook
    ```
2.  Open `bored.ipynb` in the browser interface that appears.
3.  Run the cells to see the step-by-step implementation and animations.

### Web Visualizer
To use the interactive web-based visualizer (BFS, DFS, A*):

1.  Start a local HTTP server:
    ```bash
    python3 -m http.server 8000
    ```
2.  Open your web browser and navigate to:
    [http://localhost:8000/grid_pathfinder/index.html](http://localhost:8000/grid_pathfinder/index.html)

3. more dets in the readme
