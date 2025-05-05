import re
from django.views.generic import TemplateView
from django.views.generic.edit import FormView
from .forms import FamilyForm
from .models import FamilyTree, Person


class HoweView(TemplateView):
    template_name = 'index.html'


class CreateFamilyView(FormView):
    form_class = FamilyForm
    template_name = "family-form.html"
    success_url = "/registration-completed"

    def form_valid(self, form: FamilyForm):
        data = form.cleaned_data
        family = FamilyTree(name=data['family_name']).save()

        if data['male_partner_choice'] or data['new_male_partner']:
            if data['male_partner_choice']:
                male_partner = Person.nodes.get(uid=data['male_partner_choice'])
            
            elif data['new_male_partner']:
                male_partner = Person(
                    firstname=data['new_male_partner']['firstname'],
                    birth_date=data['new_male_partner']['birth_date'],
                    sex='male'
                ).save()
            
            family.members.connect(male_partner, {'status': 'partner'})
        
        if data['female_partner_choice'] or data['new_female_partner']:
            if data['female_partner_choice']:
                female_partner = Person.nodes.get(uid=data['female_partner_choice'])
            
            elif data['new_female_partner']:
                female_partner = Person(
                    firstname=data['new_female_partner']['firstname'],
                    birth_date=data['new_female_partner']['birth_date'],
                    sex='female'
                ).save()
            
            family.members.connect(female_partner, {'status': 'partner'})

        if data['children_choices'] != [''] or data['new_children'] != []:
            if data['children_choices'] != ['']:
                for uid in data['children_choices']:
                    child = Person.nodes.get(uid=uid)
                    family.members.connect(child, {'status': 'child'})
            
            if data['new_children'] != []:
                for object in data['new_children']:
                    child = Person(
                        firstname=object['firstname'],
                        birth_date=object['birth_date'],
                        sex=object['sex']
                    ).save()
                    family.members.connect(child, {'status': 'child'})
        return super().form_valid(form)
    

class RegistrationCompleteView(TemplateView):
    template_name = "form-successful.html"
