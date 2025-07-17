from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import upload_jd_file
from .views import match_resume_jd
from .views import get_latest_analysis
from .views import (
    react_index,
    sample_data,
    ResumeUploadAPIView,
    SkillGapAnalysisView,
    ResumeAnalysisViewSet
)
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,)
from analysis.views import RegisterView
from .views import RegisterView, ResumeAnalysisView
router = DefaultRouter()
router.register(r'analyses', ResumeAnalysisViewSet)

urlpatterns = [
    # path('', upload_resume, name='upload_resume'),
    # path('dashboard/', views.resume_dashboard, name='resume_dashboard'),
    # path('export/csv/', views.export_resumes_csv, name='export_resumes_csv'),
    # path('resume/<int:resume_id>/pdf/', 
    path('', react_index, name='react-index'),
    path('api/sample/', sample_data, name='sample_data'),
    path('api/upload-resume/', ResumeUploadAPIView.as_view(), name='upload-resume'),
    path('api/skill-gap-analysis/', SkillGapAnalysisView.as_view(), name='skill-gap-analysis'),
    path('api/latest-analysis/', get_latest_analysis),
    path('api/sample/', views.sample_api),
    path('api/current-analysis/', views.current_analysis),
    path('api/dashboard-stats/', views.dashboard_stats),
    path('api/recent-analyses/', views.recent_analyses),
    path('api/upload-jd/', upload_jd_file),
    path('api/match-resume-jd/', match_resume_jd),
  
    path('api/register/', RegisterView.as_view(), name='register'),
    path('register/', RegisterView.as_view(), name='register'),
    path('register/', RegisterView.as_view(), name='register'),
    path('analyze/', ResumeAnalysisView.as_view(), name='resume_analysis'),
    
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('register/', RegisterView.as_view(), name='register'),
    path('analyze/', ResumeAnalysisView.as_view(), name='resume_analysis'),

    # ✅ Include the router-generated URLs like /api/analyses/
    path('api/', include(router.urls)),
]
