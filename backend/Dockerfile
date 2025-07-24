# Use a smaller base image
FROM python:3.13-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy only necessary application files
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Use a non-root user for better security
USER nobody

# Command to run the application
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
