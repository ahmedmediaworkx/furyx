@echo off
setlocal

set ECR_URL=312527861191.dkr.ecr.us-east-1.amazonaws.com/furyx
set REGION=us-east-1
set CLUSTER=furyx
set SERVICE=furyx

echo [1/4] Logging into ECR...
aws ecr get-login-password --region %REGION% | docker login --username AWS --password-stdin %ECR_URL%
if errorlevel 1 goto :error

echo [2/4] Building Docker image...
docker build -t furyx .
if errorlevel 1 goto :error

echo [3/4] Tagging and pushing to ECR...
docker tag furyx:latest %ECR_URL%:latest
docker push %ECR_URL%:latest
if errorlevel 1 goto :error

echo [4/4] Forcing ECS redeployment...
aws ecs update-service --cluster %CLUSTER% --service %SERVICE% --force-new-deployment --region %REGION%
if errorlevel 1 goto :error

echo.
echo Done! App will be live at:
echo http://furyx-alb-387972706.us-east-1.elb.amazonaws.com
goto :end

:error
echo ERROR: Step failed. Check output above.
exit /b 1

:end
endlocal
