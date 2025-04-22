from rest_framework import serializers


class MemberSerializer(serializers.Serializer):
    firstname = serializers.CharField()


class PayloadSerializer(serializers.Serializer):
    parents = MemberSerializer(many=True)
    children = MemberSerializer(many=True)


class FamilySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    type = serializers.ChoiceField(choices=['family', 'person'])
    name = serializers.CharField()
    payload = PayloadSerializer()
