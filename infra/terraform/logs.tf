resource "aws_cloudwatch_log_group" "furyx" {
  name              = "/ecs/${var.app_name}"
  retention_in_days = 30
}
