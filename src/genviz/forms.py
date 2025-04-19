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

    firstname = forms.CharField()
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

ChildFormSet = forms.formset_factory(ChildForm, extra=0)


class FamilyForm(forms.Form):
    def __init__(self, data=None, *args, **kwargs):
        super().__init__(data, *args, **kwargs)

        self.new_first_partner = PersonForm(data=data, prefix='first_partner')
        self.new_second_partner = PersonForm(data=data, prefix='second_partner')
        self.children = ChildFormSet(data, prefix='children')

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
        required=False,
        initial=[""]
    )

    def is_valid(self):
        valid = super().is_valid()

        partners_valid = self.new_first_partner.is_valid() and self.new_second_partner.is_valid()
        children_valid = self.children.is_valid()

        return valid and partners_valid and children_valid
    