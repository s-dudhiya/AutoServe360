# urls.py
from django.urls import path
from .views import( LoginView, VehicleFindAPIView,
    MechanicListAPIView,JobCardListCreateAPIView,JobCardDetailAPIView,
    PartListCreateAPIView,PartDetailAPIView,IssuePartAPIView )

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('vehicles/find/', VehicleFindAPIView.as_view(), name='vehicle-find'),
    path('users/mechanics/', MechanicListAPIView.as_view(), name='mechanic-list'),
    path('jobcards/', JobCardListCreateAPIView.as_view(), name='jobcard-create'),
    path('jobcards/<int:pk>/', JobCardDetailAPIView.as_view(), name='jobcard-detail'),
    path('parts/', PartListCreateAPIView.as_view(), name='part-list-create'),
    
    path('parts/<int:pk>/', PartDetailAPIView.as_view(), name='part-detail'),

    path('jobcards/<int:pk>/issue-part/', IssuePartAPIView.as_view(), name='jobcard-issue-part'),
]
