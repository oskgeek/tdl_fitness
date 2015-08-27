from django.conf.urls import url

urlpatterns = [
    url(r'^login/$', 'plan_marker.views.login'),
    url(r'^signup/$', 'plan_marker.views.signup'),
    url(r'^excercise/$', 'plan_marker.views.excercise_handler'),
    url(r'^plan_created/$', 'plan_marker.views.plan_handler'),

]
