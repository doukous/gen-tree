from django.shortcuts import redirect, render
from django.http import HttpRequest, HttpResponse
from genviz.forms import FamilyForm
from genviz.models import FamilyTree, Person


def home(request: HttpRequest):
    return render(request, 'index.html')


def new_family(request: HttpRequest):
    family_form = FamilyForm()

    if request.method == "GET":
        context = {'family_form': family_form}

        return render(request, 'family-form.html', context)
    
    elif request.method == "POST":
        pass

    return redirect('home')


def register_family(request: HttpRequest):
    form = FamilyForm(data=request.GET)
    form.is_valid()
    
    data = form.cleaned_data

    new_family_tree = FamilyTree(name=data['family_name']).save()

    first_partner = Person(
        firstname=data['new_first_partner']['firstname'],
        sex='male'
    ).save()

    new_family_tree.members.connect(first_partner, {'role': 'parent'}).save()

    second_partner = Person(
        firstname=data['new_second_partner']['firstname'],
        sex='female'
    ).save()

    new_family_tree.members.connect(second_partner, {'role': 'parent'}).save()

    for child_data in data['children']:
        child = Person(
            firstname=child_data['firstname'],
            sex=child_data['sex']
        ).save()

        new_family_tree.members.connect(child, {'role': 'child'}).save()
    

    return HttpResponse('successfullly registered, <a href="/">go back home</a>')
