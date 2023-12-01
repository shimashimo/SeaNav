import subprocess

# Replace 'your_matlab_script.m' with the name of your MATLAB script
matlab_script = "C:\\Users\\nicpi\ECE356\SeaNav\matlab\Archive\WitMotion.m"

# Run MATLAB script using subprocess
subprocess.run(['matlab', '-nodesktop', '-noFigureWindows', '-batch', f"run('{matlab_script}')"])