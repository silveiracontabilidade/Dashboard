from datetime import date

from .models import Automation

SEED_AUTOMATIONS = [
    {
        'name': 'Geração de Propostas Comerciais',
        'department': 'Comercial',
        'type': 'IA',
        'time_before': 150,
        'time_after': 20,
        'implementation_date': date(2026, 3, 25),
        'responsible': 'Camila Rocha',
        'description': 'Criação automática de proposta comercial com apoio de IA.',
        'status': 'Ativa',
    },
    {
        'name': 'Lançamento Fiscal Automatizado',
        'department': 'Fiscal',
        'type': 'Power Automate',
        'time_before': 60,
        'time_after': 5,
        'implementation_date': date(2026, 3, 10),
        'responsible': 'Marcos Pereira',
        'description': 'Automação para agilizar lançamentos e conferências fiscais.',
        'status': 'Ativa',
    },
    {
        'name': 'Envio de NFs para Clientes',
        'department': 'Financeiro',
        'type': 'Automação',
        'time_before': 45,
        'time_after': 5,
        'implementation_date': date(2026, 2, 28),
        'responsible': 'Juliana Ferreira',
        'description': 'Disparo automático de notas fiscais para clientes.',
        'status': 'Ativa',
    },
    {
        'name': 'Análise Contábil por IA',
        'department': 'Contábil',
        'type': 'IA',
        'time_before': 480,
        'time_after': 60,
        'implementation_date': date(2026, 2, 15),
        'responsible': 'Roberto Alves',
        'description': 'Análise inicial de dados contábeis com apoio de IA.',
        'status': 'Ativa',
    },
    {
        'name': 'Fluxo de Aprovação Interna',
        'department': 'Processos',
        'type': 'Power Automate',
        'time_before': 90,
        'time_after': 10,
        'implementation_date': date(2026, 1, 20),
        'responsible': 'Fernanda Souza',
        'description': 'Automação do fluxo de aprovação interna entre áreas.',
        'status': 'Ativa',
    },
    {
        'name': 'Atendimento ao Cliente com Chatbot',
        'department': 'Comercial',
        'type': 'IA',
        'time_before': 300,
        'time_after': 45,
        'implementation_date': date(2026, 1, 10),
        'responsible': 'Lucas Oliveira',
        'description': 'Atendimento inicial e triagem automatizada.',
        'status': 'Ativa',
    },
    {
        'name': 'Conciliação Bancária',
        'department': 'Financeiro',
        'type': 'Automação',
        'time_before': 120,
        'time_after': 10,
        'implementation_date': date(2025, 12, 1),
        'responsible': 'Pedro Lima',
        'description': 'Conciliação automatizada de lançamentos bancários.',
        'status': 'Ativa',
    },
    {
        'name': 'Onboarding de Colaboradores',
        'department': 'RH',
        'type': 'Automação',
        'time_before': 240,
        'time_after': 30,
        'implementation_date': date(2025, 11, 15),
        'responsible': 'Ana Martins',
        'description': 'Fluxo de onboarding com tarefas e lembretes automáticos.',
        'status': 'Ativa',
    },
    {
        'name': 'Classificação de E-mails',
        'department': 'TI',
        'type': 'IA',
        'time_before': 60,
        'time_after': 5,
        'implementation_date': date(2025, 10, 8),
        'responsible': 'Diego Ramos',
        'description': 'Classificação inteligente de mensagens por prioridade.',
        'status': 'Ativa',
    },
    {
        'name': 'Geração Automática de Relatórios',
        'department': 'CSI',
        'type': 'IA',
        'time_before': 180,
        'time_after': 15,
        'implementation_date': date(2025, 9, 12),
        'responsible': 'Felipe Vidoi',
        'description': 'Geração automatizada de relatórios gerenciais.',
        'status': 'Ativa',
    },
]


def seed_automations(force: bool = False) -> int:
    if force:
        Automation.objects.all().delete()

    if Automation.objects.exists():
        return 0

    Automation.objects.bulk_create([Automation(**item) for item in SEED_AUTOMATIONS])
    return len(SEED_AUTOMATIONS)
