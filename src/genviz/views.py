from django.http import HttpResponse
from django.views import View
from django.views.generic import TemplateView
from django.views.generic.edit import FormView
from genviz.forms import FamilyForm


class HoweView(TemplateView):
    template_name = 'index.html'


class CreateFamilyView(FormView):
    template_name = "family-form.html"
    form_class = FamilyForm
    success_url = "/registration-completed"


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['family_form'] = context.pop('form')
        return context

class RegistrationCompleteView(View):
    def get(self, request):
        return HttpResponse('successfullly registered, <a href="/">go back home</a>')
