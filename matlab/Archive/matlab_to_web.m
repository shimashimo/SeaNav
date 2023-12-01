% Create a function to continuously update simulation data
function liveSimulationWebApp()

    % Create a Web App
    webApp = webapp("liveSimulationApp");

    % Create a figure for the live plot
    fig = uifigure('visible', 'off');
    plotAxes = uiaxes('parent', fig);
    title(plotAxes, 'Live Simulation');
    xlabel(plotAxes, 'Time');
    ylabel(plotAxes, 'Value');
    
    % Run the simulation
    t = 0;
    while true % Replace this with your condition to stop the simulation
        % Simulate your data (replace this with your simulation code)
        y = sin(t);
        
        % Update the plot
        plot(plotAxes, t, y, 'bo'); % Update the plot with new data point
        drawnow limitrate; % Force update the plot
        
        % Update time (replace this with your simulation's time increment)
        t = t + 0.1;
        
        % Update the web app with the figure containing the live plot
        webApp.update(figureToWeb(plotAxes, 'Visible', 'off'));
        pause(0.1); % Adjust this to control the speed of the simulation
    end
end
