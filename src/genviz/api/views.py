from .serializers import FamilySerializer
from ..models import FamilyTree
from rest_framework import viewsets
from rest_framework.response import Response


class FamilyViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = FamilyTree.nodes.all()
        serializer = FamilySerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = FamilyTree.nodes
        family = queryset.get(uid=pk)
        serializer = FamilySerializer(family)
        return Response(serializer.data)