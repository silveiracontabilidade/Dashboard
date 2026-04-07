from django.db import models


class Automation(models.Model):
    DEPARTMENTS = [
        ('TI', 'TI'),
        ('Financeiro', 'Financeiro'),
        ('RH', 'RH'),
        ('Comercial', 'Comercial'),
        ('Fiscal', 'Fiscal'),
        ('Contábil', 'Contábil'),
        ('Marketing', 'Marketing'),
        ('Pessoal', 'Pessoal'),
        ('Empresarial', 'Empresarial'),
        ('Processos', 'Processos'),
        ('CSI', 'CSI'),
    ]

    TYPES = [
        ('IA', 'IA'),
        ('Automação', 'Automação'),
        ('Power Automate', 'Power Automate'),
    ]

    STATUSES = [
        ('Ativa', 'Ativa'),
        ('Em Desenvolvimento', 'Em Desenvolvimento'),
        ('Pausada', 'Pausada'),
    ]

    name = models.CharField(max_length=255)
    department = models.CharField(max_length=50, choices=DEPARTMENTS)
    type = models.CharField(max_length=50, choices=TYPES)
    time_before = models.PositiveIntegerField()
    time_after = models.PositiveIntegerField()
    implementation_date = models.DateField()
    responsible = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=30, choices=STATUSES, default='Ativa')

    class Meta:
        ordering = ['-implementation_date', '-id']

    def __str__(self) -> str:
        return self.name

    @property
    def time_saved(self) -> int:
        return max(self.time_before - self.time_after, 0)

    @property
    def productivity_gain_percent(self) -> float:
        if not self.time_before:
            return 0.0
        return (self.time_saved / self.time_before) * 100
