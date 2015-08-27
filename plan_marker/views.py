import json
import datetime

from django.conf import settings
from django.http import HttpResponse
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth.models import User
from plan_marker.models import UserProfile, Excercise


@csrf_exempt
def login(request):
    response_dict = {'status': 'UNKNOWN', 'Error': []}
    
    if request.method == 'POST':
        email = request.POST.get('email', None)
        password = request.POST.get('password', None)
        user = authenticate(username=email, password=password)

        if user is not None:
            response_dict['status'] = 'OK'
            response_dict['user_type'] = user.userprofile.group
            response_dict['last_login'] = user.last_login or str(datetime.datetime.now())
        else:
            response_dict['status'] = 'FAILED'
            
    return HttpResponse(json.dumps(response_dict))


@csrf_exempt
def signup(request):
    response_dict = {'status': 'UNKNOWN', 'Error': []}
    
    if request.method == 'POST':
        try:
            email = request.POST.get('email', None)
            password = request.POST.get('password', None)
            
            user = User.objects.create_user(username=email, password=password, email=email)
            user.save()
            user_profile = UserProfile()
            user_profile.user = user
            user_profile.group = 'MM'
            user_profile.save()
            
            response_dict['status'] = 'OK'
        
        except Exception as ex:
            response_dict['status'] = 'FAILED'
            response_dict['Error'] = repr(ex)

    return HttpResponse(json.dumps(response_dict))

@csrf_exempt
def excercise_handler(request):
    response_dict = {'status': 'UNKNOWN', 'Error': []}
    try:
        if request.method == 'POST':
            image = request.FILES['ex_image']
            image_path = settings.MEDIA_ROOT + 'files_library/%s' % str(image.name).rstrip()
            with open(image_path, 'wb+') as image_file:
                for chunk in image.chunks():
                    image_file.write(chunk)
            
            ex_obj = Excercise()
            ex_obj.name = request.POST['ex_name']
            ex_obj.image_path = image_path
            ex_obj.save()
            
            response_dict['status'] = 'OK'
        
        else:
            ex_vs = list(Excercise.objects.values_list('name', 'image_path'))
            response_dict['data'] = ex_vs
            response_dict['status'] = 'OK'

    except Exception as ex:
        response_dict['status'] = 'FAILED'
        response_dict['Error'] = repr(ex)

    return HttpResponse(json.dumps(response_dict))
