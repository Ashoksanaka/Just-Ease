from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Case(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cases')
    victim_name = models.CharField(max_length=255)
    mobile_number = models.CharField(max_length=20)
    address = models.TextField()
    statement = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Case {self.id} - {self.victim_name}"

class CaseDocument(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='documents')
    document = models.FileField(upload_to='case_documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Document for case {self.case.id}"

class CaseVideo(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='videos')
    video = models.FileField(upload_to='case_videos/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Video for case {self.case.id}"