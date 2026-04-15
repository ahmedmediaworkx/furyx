variable "aws_region" {
  default = "us-east-1"
}

variable "app_name" {
  default = "furyx"
}

variable "nextauth_url" {
  description = "Public URL of the app, e.g. https://furyx.example.com"
}

variable "nextauth_secret" {
  description = "Long random secret for NextAuth"
  sensitive   = true
}

variable "mongodb_uri" {
  description = "MongoDB connection string (Atlas or DocumentDB)"
  sensitive   = true
}

variable "container_cpu" {
  default = 512
}

variable "container_memory" {
  default = 1024
}
