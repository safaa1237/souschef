locals {
  common_name = "${var.project_name}-${var.environment}"
}

resource "aws_ecr_repository" "backend" {
  name = "${local.common_name}-backend"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}