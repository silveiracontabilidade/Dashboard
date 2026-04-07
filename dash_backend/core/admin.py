from django.contrib import admin

from .models import Automation


@admin.register(Automation)
class AutomationAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'department',
        'type',
        'status',
        'implementation_date',
        'responsible',
        'time_before',
        'time_after',
    )
    list_filter = ('department', 'type', 'status')
    search_fields = ('name', 'responsible', 'description')
    ordering = ('-implementation_date', '-id')
