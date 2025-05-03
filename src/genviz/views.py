from django.views.generic import TemplateView
from django.views.generic.edit import FormView
from genviz.forms import FamilyForm


class HoweView(TemplateView):
    template_name = 'index.html'


class CreateFamilyView(FormView):
    form_class = FamilyForm
    template_name = "family-form.html"
    success_url = "/registration-completed"

    def form_valid(self, form: FamilyForm):
        return super().form_valid(form)
    

class RegistrationCompleteView(TemplateView):
    template_name = "form-successful.html"
