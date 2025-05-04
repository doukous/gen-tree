from datetime import date
from pprint import pprint
from django import forms


class PersonForm(forms.Form):
    MEN_CHOICES = {
        ('', 'Choose a partner'),
        ('mohamed', 'Mohamed'),
        ('adama', 'Adama'),
        ('saliou', 'Saliou')
    }

    WOMEN_CHOICES = {
        ('', 'Choose a partner'),
        ('khadija', 'Khadija'),
        ('mareme', 'Mareme'),
        ('awa', 'Awa')
    }

    firstname = forms.CharField(required=False)
    birth_date = forms.DateField(
        widget=forms.DateInput(),
        required=False
    )

    def clean_birth_date(self):
        cleaned_data = super().clean()
        cleaned_date = cleaned_data.get('birth_date')
        
        if cleaned_date and cleaned_date > date.today():
            raise forms.ValidationError('the date is in the future...')

        return cleaned_date

class ChildForm(PersonForm):
    SEX_CHOICES = {
        ('', 'Choose the sex'),
        ('male', 'Male'),
        ('female', 'Female')
    }
    
    sex = forms.ChoiceField(choices=SEX_CHOICES, required=True)

ChildFormSet = forms.formset_factory(ChildForm, extra=0)


class FamilyForm(forms.Form):
    def __init__(self, data=None, *args, **kwargs):
        super().__init__(data, *args, **kwargs)

        self.nested_data = {
            'new_male_partner': None,
            'new_female_partner': None,
            'new_children': None
        }

        if data:
            self.nested_data = {}

            children_data = {key:data[key] for key in data.keys() if key.startswith('new_children')}
            self.nested_data['new_children'] = children_data

            male_partner_data = {key:data[key] for key in data.keys() if key.startswith('new_male_partner')}
            self.nested_data['new_male_partner'] = male_partner_data

            female_partner_data = {key:data[key] for key in data.keys() if key.startswith('new_female_partner')}
            self.nested_data['new_female_partner'] = female_partner_data

            
        self.new_male_partner = PersonForm(data=self.nested_data['new_male_partner'], prefix='new_male_partner')
        self.new_female_partner = PersonForm(data=self.nested_data['new_female_partner'], prefix='new_female_partner')
        self.children = ChildFormSet(data=self.nested_data['new_children'], prefix='new_children')

    family_name = forms.CharField()

    male_partner_choice = forms.ChoiceField(
        choices=PersonForm.MEN_CHOICES, 
        required=False    
    )

    female_partner_choice = forms.ChoiceField(
        choices=PersonForm.WOMEN_CHOICES, 
        required=False
    )

    all_people = PersonForm.MEN_CHOICES.copy()
    all_people.update(PersonForm.WOMEN_CHOICES)

    children_choices = forms.MultipleChoiceField(
        choices=all_people, 
        initial=[''],
        required=False
    )

    def is_valid(self):
        valid = super().is_valid()
        partners_valid = self.new_male_partner.is_valid() and self.new_female_partner.is_valid()
        children_valid = self.children.is_valid()

        return valid and partners_valid and children_valid
    
    def clean(self):
        cleaned_data = super().clean()
        self.new_male_partner.is_valid()
        self.new_female_partner.is_valid()
        self.children.is_valid()

        if not (self.cleaned_data['male_partner_choice'] or self.new_male_partner.cleaned_data['firstname']) \
            and not (self.cleaned_data['female_partner_choice'] or self.new_female_partner.cleaned_data['firstname']):
            raise forms.ValidationError('at least one partner need to be defined')
        
        elif self.cleaned_data['male_partner_choice'] and self.new_male_partner.cleaned_data['firstname']:
            raise forms.ValidationError('cannot set first partner choice and create a new first partner at the same time')
    
        elif self.cleaned_data['female_partner_choice'] and self.new_female_partner.cleaned_data['firstname']:
            raise forms.ValidationError('cannot set second partner choice and create a new second partner at the same time')

        cleaned_nested_data = cleaned_data.copy()
        cleaned_nested_data['new_male_partner'] = self.new_male_partner.cleaned_data
        cleaned_nested_data['new_female_partner'] = self.new_female_partner.cleaned_data
        cleaned_nested_data['new_children'] = [form.cleaned_data for form in self.children]

        return cleaned_nested_data
    