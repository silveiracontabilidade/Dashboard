from rest_framework import serializers

from .models import Automation


class AutomationSerializer(serializers.ModelSerializer):
    time_saved = serializers.IntegerField(read_only=True)
    productivity_gain_percent = serializers.FloatField(read_only=True)

    class Meta:
        model = Automation
        fields = [
            'id',
            'name',
            'department',
            'type',
            'time_before',
            'time_after',
            'time_saved',
            'productivity_gain_percent',
            'implementation_date',
            'responsible',
            'description',
            'status',
        ]
