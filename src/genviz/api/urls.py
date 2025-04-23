from .views import FamilyViewSet
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'families', FamilyViewSet, basename='family')

urlpatterns = router.urls
