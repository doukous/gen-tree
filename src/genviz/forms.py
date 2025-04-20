from datetime import date
from django import forms


class PersonForm(forms.Form):
    MEN_CHOICES = {
        ('', '---choisir---'),
        ('mohamed', 'Mohamed'),
        ('adama', 'Adama'),
        ('saliou', 'Saliou')
    }

    WOMEN_CHOICES = {
        ('', '---choisir---'),
        ('khadija', 'Khadija'),
        ('mareme', 'Mareme'),
        ('awa', 'Awa')
    }

    firstname = forms.CharField(required=False)
    birth_date = forms.DateField(
        widget=forms.DateInput(attrs={
           'type': 'date',
        }),
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
        ('', '---choisir---'),
        ('male', 'Homme'),
        ('female', 'Femme')
    }
    
    sex = forms.ChoiceField(choices=SEX_CHOICES, initial='male', required=False)
    role = 'child'

ChildFormSet = forms.formset_factory(ChildForm, extra=1)


class FamilyForm(forms.Form):
    def __init__(self, data=None, *args, **kwargs):
        super().__init__(data, *args, **kwargs)

        self.nested_data = {
            'new_first_partner': None,
            'new_second_partner': None,
            'new_children': None
        }

        if data:
            self.nested_data = {}

            children_data = {key:data[key] for key in data.keys() if key.startswith('new_children')}
            self.nested_data['new_children'] = children_data

            first_partner_data = {key:data[key] for key in data.keys() if key.startswith('new_first_partner')}
            self.nested_data['new_first_partner'] = first_partner_data

            second_partner_data = {key:data[key] for key in data.keys() if key.startswith('new_second_partner')}
            self.nested_data['new_second_partner'] = second_partner_data

            
        self.new_first_partner = PersonForm(data=self.nested_data['new_first_partner'], prefix='new_first_partner')
        self.new_second_partner = PersonForm(data=self.nested_data['new_second_partner'], prefix='new_second_partner')
        self.children = ChildFormSet(data=self.nested_data['new_children'], prefix='new_children')

    family_name = forms.CharField(initial='family name')

    first_partner_choice = forms.ChoiceField(
        choices=PersonForm.MEN_CHOICES, 
        required=False    
    )

    second_partner_choice = forms.ChoiceField(
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
        partners_valid = self.new_first_partner.is_valid() and self.new_second_partner.is_valid()
        children_valid = self.children.is_valid()

        return valid and partners_valid and children_valid
    
    def clean(self):
        cleaned_data = super().clean()
        self.new_first_partner.is_valid()
        self.new_second_partner.is_valid()

        if not (self.cleaned_data['first_partner_choice'] or self.new_first_partner.cleaned_data['firstname']) \
            and not (self.cleaned_data['second_partner_choice'] or self.new_second_partner.cleaned_data['firstname']):

            raise forms.ValidationError('at least one partner need to be defined')
        
        elif self.cleaned_data['first_partner_choice'] and self.new_first_partner.cleaned_data['firstname']:
            raise forms.ValidationError('cannot set first partner choice and create a new first partner at the same time')
    
        elif self.cleaned_data['second_partner_choice'] and self.new_second_partner.cleaned_data['firstname']:
            raise forms.ValidationError('cannot set second partner choice and create a new second partner at the same time')

        return cleaned_data
    