resource "aws_secretsmanager_secret" "nextauth_secret" {
  name = "${var.app_name}/NEXTAUTH_SECRET"
}

resource "aws_secretsmanager_secret_version" "nextauth_secret" {
  secret_id     = aws_secretsmanager_secret.nextauth_secret.id
  secret_string = var.nextauth_secret
}

resource "aws_secretsmanager_secret" "mongodb_uri" {
  name = "${var.app_name}/MONGODB_URI"
}

resource "aws_secretsmanager_secret_version" "mongodb_uri" {
  secret_id     = aws_secretsmanager_secret.mongodb_uri.id
  secret_string = var.mongodb_uri
}
