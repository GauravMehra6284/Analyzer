from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from analysis.views import react_index
from analysis.views import RegisterView

# ✅ Add this line
from pathlib import Path
import os
from django.urls import path, include

BASE_DIR = Path(__file__).resolve().parent.parent  # <-- Define BASE_DIR here

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', react_index),  # Serve React frontend at root "/"
    
    path('', include('analysis.urls')),  
    path('api/', include('analysis.urls')), 
    
]

# ✅ Serve static files like React assets during development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=BASE_DIR / 'frontend' / 'assets')
