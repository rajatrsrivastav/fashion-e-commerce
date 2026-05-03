output "bucket_name" {
  value       = aws_s3_bucket.main.id
  description = "S3 bucket name"
}

output "bucket_arn" {
  value       = aws_s3_bucket.main.arn
  description = "S3 bucket ARN"
}

output "ecs_cluster" {
  value = aws_ecs_cluster.main.name
}

output "ecs_service" {
  value = aws_ecs_service.app.name
}

output "ecr_repo" {
  value = aws_ecr_repository.app.repository_url
}

output "container_name" {
  value = "web"
}
