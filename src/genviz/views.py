from django.shortcuts import redirect
from django.views import View
from django.views.generic import TemplateView
from django.views.generic.edit import FormView
from genviz.forms import FamilyForm


class HoweView(TemplateView):
    template_name = 'index.html'


class CreateFamilyView(FormView):
    form_class = FamilyForm
    template_name = "family-form.html"
    success_url = "/registration-completed"


class RegistrationCompleteView(View):
    def get(self, request):
        return redirect('home')