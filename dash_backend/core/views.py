from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Automation
from .serializers import AutomationSerializer
from .seed_data import seed_automations


class AutomationViewSet(viewsets.ModelViewSet):
    queryset = Automation.objects.all()
    serializer_class = AutomationSerializer

    @action(detail=False, methods=['post'])
    def reset(self, request):
        created = seed_automations(force=True)
        return Response({'seeded': created}, status=status.HTTP_200_OK)

# Create your views here.
