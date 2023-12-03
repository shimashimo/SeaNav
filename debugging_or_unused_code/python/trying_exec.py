import subprocess

matlab_script = '/Users/echatham/Documents/MATLAB/WitMotion.m'

# Run MATLAB script using subprocess
subprocess.run(['/Applications/MATLAB_R2023b.app/bin/matlab', '-nodesktop', '-batch', f"run('{matlab_script}')"])