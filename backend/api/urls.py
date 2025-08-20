# urls.py
from django.urls import path
from .views import( InvoiceExportAPIView, LoginView, ServiceTaskUpdateAPIView, VehicleFindAPIView,
    MechanicListAPIView,JobCardListCreateAPIView,JobCardDetailAPIView,
    PartListCreateAPIView,PartDetailAPIView,IssuePartAPIView,InvoiceCreateAPIView,InvoicePDFView,
    ReportsAPIView,MyJobsAPIView,JobCardStatusUpdateAPIView, UserProfileView,ChangePinView  )

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('vehicles/find/', VehicleFindAPIView.as_view(), name='vehicle-find'),
    path('users/mechanics/', MechanicListAPIView.as_view(), name='mechanic-list'),
    path('jobcards/', JobCardListCreateAPIView.as_view(), name='jobcard-create'),
    path('jobcards/<int:pk>/', JobCardDetailAPIView.as_view(), name='jobcard-detail'),
    path('parts/', PartListCreateAPIView.as_view(), name='part-list-create'),
    path('parts/<int:pk>/', PartDetailAPIView.as_view(), name='part-detail'),
    path('jobcards/<int:pk>/issue-part/', IssuePartAPIView.as_view(), name='jobcard-issue-part'),
    path('jobcards/<int:pk>/create-invoice/', InvoiceCreateAPIView.as_view(), name='jobcard-create-invoice'),
    path('jobcards/<int:pk>/invoice-pdf/', InvoicePDFView.as_view(), name='jobcard-invoice-pdf'),
    path('reports/', ReportsAPIView.as_view(), name='reports-data'),
    path('invoices/export/', InvoiceExportAPIView.as_view(), name='invoice-export-data'),
    path('my-jobs/', MyJobsAPIView.as_view(), name='my-jobs'),
    path('jobcards/<int:pk>/update-status/', JobCardStatusUpdateAPIView.as_view(), name='jobcard-update-status'),
    path('tasks/<int:pk>/update/', ServiceTaskUpdateAPIView.as_view(), name='task-update'),
     path('users/<int:pk>/', UserProfileView.as_view(), name='user-profile'),
    path('users/<int:pk>/change-pin/', ChangePinView.as_view(), name='change-pin'),
]
