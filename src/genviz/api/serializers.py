from pprint import pprint
from rest_framework import serializers


class PersonSerializer(serializers.Serializer):
    uid = serializers.UUIDField(format='hex_verbose')
    firstname = serializers.CharField()
    sex = serializers.CharField()


class MembersSerializer(serializers.Serializer):
    parents = PersonSerializer(many=True)
    children = PersonSerializer(many=True)


class FamilySerializer(serializers.Serializer):
    uid = serializers.UUIDField(format='hex_verbose')
    name = serializers.CharField()
    payload = MembersSerializer()
    