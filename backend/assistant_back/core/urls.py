from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, TicketViewSet, PaymentViewSet

router = DefaultRouter()
router.register(r'customers', CustomerViewSet)
router.register(r'tickets', TicketViewSet)
router.register(r'payments', PaymentViewSet)

urlpatterns = router.urls
