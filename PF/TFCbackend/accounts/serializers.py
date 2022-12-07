from rest_framework import serializers  
from phonenumber_field.validators import validate_international_phonenumber  
from django.utils.translation import gettext_lazy as _  
from django.contrib.auth import get_user_model  
from django.contrib.auth import authenticate  
  
from .models import Account, Subscription, Payment, PaymentInfo, SubscriptionType

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['type']
    
    def serialize(sub):
        json_data = {'sub_type': str(sub.sub_type),
                    'start_date': sub.start_date,
                    'next_payment_date': sub.next_payment_date,
        }
        return json_data

    def create(self, validated_data):
        type = validated_data['type']  
        return super().create(type=type)  
  
    def save(self, validated_data, subscription):  
        for key in validated_data:  
            setattr(subscription, key, validated_data[key])  
        subscription.save()  
        return subscription  
  
class PaymentInfoSerializer(serializers.ModelSerializer):  
    class Meta:
        model = PaymentInfo  
        fields = ['credit_num', 'credit_exp_year', 'credit_exp_month', 'credit_cvv']  
    
    def serialize(paymentInfo):
        json_data = {'credit_num': paymentInfo.credit_num,
                    'credit_exp_year': paymentInfo.credit_exp_year,
                    'credit_exp_month': paymentInfo.credit_exp_month,
                    'credit_cvv': paymentInfo.credit_cvv,
        }
        return json_data
  
    def save(self, validated_data, payment_info):  
        for key in validated_data:  
            setattr(payment_info, key, validated_data[key])  
        payment_info.save()  
        return payment_info

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'account', 'amount', 'datetime', 'payment_info']
        depth = 1

  
class AuthTokenSerializer(serializers.Serializer):  
    email = serializers.CharField(  
        label=_("Email"),  
        write_only=True  
    )  
    password = serializers.CharField(  
        label=_("Password"),  
        style={'input_type': 'password'},  
        trim_whitespace=False,  
        write_only=True  
    )  
    token = serializers.CharField(  
        label=_("Token"),  
        read_only=True  
    )  
  
    def validate(self, attrs):  
        email = attrs.get('email')  
        password = attrs.get('password')  
  
        if email and password:  
            user = authenticate(request=self.context.get('request'),  
                                email=email, password=password)  
            if not user:  
                msg = _('Unable to log in with provided credentials.')  
                raise serializers.ValidationError(msg, code='authorization')  
        else:  
            msg = _('Must include "username" and "password".')  
            raise serializers.ValidationError(msg, code='authorization')  
  
        attrs['user'] = user  
        return attrs  
  
  
class ParentAccountSerializer(serializers.ModelSerializer):  
    #Parent serializer for single serialize function  
    def serialize(self, account):  
        json_data = {'email': account.email,  
                'first_name': account.first_name,  
                'last_name': account.last_name,  
                'phone_num': str(account.phone_num),  
                'avatar': account.avatar.url}  
        return json_data  
  
  
class RegisterAccountSerializer(ParentAccountSerializer, serializers.ModelSerializer):  
    repeat_password = serializers.CharField()  
  
    class Meta:  
        model = get_user_model()  
        fields = ['email', 'password', 'repeat_password', 'first_name', 'last_name', 'phone_num', 'avatar']  
        extra_kwargs = {  
            "password": {"write_only": True,},  
            "repeat_password": {"write_only": True,},  
        }  
      
    def validate(self, data):  
        data = data.dict()  
  
        err = {} #Store the error msgs  
        #Start by checking if any field is extra/missing  
        all_keys = ['email', 'password', 'repeat_password', 'first_name', 'last_name', 'phone_num', 'avatar']  
        unrequired = ['avatar']  
        for key in list(set(all_keys) | set(data.keys())):  
            if key not in all_keys:  
                err['extra_key'] = 'Make sure there are no extra fields.'  
                break  
            if key not in unrequired:  
                try:  
                    if not data[key]:  
                        field = key[0].upper() + key[1:]  
                        err[key] = [f'{field} field is empty.']  
                        err[key] = [msg.replace('_', ' ') for msg in err[key]]
                except:  
                    field = key[0].upper() + key[1:]  
                    err[key] = [f'{field} field is missing.'] 
                    err[key] = [msg.replace('_', ' ') for msg in err[key]]
          
        #Do passwords match, if some missing then skip  
        try:  
            if data['password'] != data['repeat_password']:  
                if 'password' in  err.keys(): 
                    err['repeat_password'].append('Passwords do not match.')  
                else:  
                    err['repeat_password'] = ['Passwords do not match.']  
        except:  
            pass  
          
        #Does the phone number have correct formatting  
        if 'phone_num' in data.keys():  
            try:  
                validate_international_phonenumber(data['phone_num'])  
            except:  
                if 'phone_num' in  err.keys():
                    err['phone_num'].append('The phone number is not valid. Example format: +12125552368')  
                else:  
                    err['phone_num'] = ['The phone number is not valid. Example format: +12125552368']  
          
        if 'email' in data.keys() and 'email' not in err.keys():  
            if Account.objects.filter(email=data['email']).exists():  
                err['email'] = ['This email is taken.']  
        if 'phone_num' in data.keys() and 'phone_num' not in err.keys():  
            if Account.objects.filter(phone_num=data['phone_num']).exists():  
                err['phone_num'] = ['This phone number is taken.']  
  
        #Raise errors if any  
        if err:  
            raise serializers.ValidationError(err)  
          
        data.pop('repeat_password')  
        return data  
      
    def create(self, validated_data):  
        email = validated_data['email']  
        password = validated_data['password']  
        validated_data.pop('email')  
        validated_data.pop('password')  
          
        account = Account.objects.create_user(email, password, **validated_data)  
        return account  
  
    def save(self, validated_data):  
        account = self.create(validated_data)  
        account.save()  
        return account  

class EditAccountSerializer(ParentAccountSerializer, serializers.ModelSerializer):  
    # API - Serialize the account with edits on, edit info  
    class Meta:  
        model = get_user_model()  
        fields = ['email', 'password', 'repeat_password', 'first_name', 'last_name', 'phone_num', 'avatar']  
        extra_kwargs = {  
            "password": {"write_only": True,},  
            "repeat_password": {"write_only": True,},  
        }  
      
    def validate(self, data):  
        data = data.dict()  
        clean_data = {}
  
        err = {} #Store the error msgs  
        #Start by checking if any field is extra or remove if they are empty  
        all_keys = ['email', 'password', 'repeat_password', 'first_name', 'last_name', 'phone_num', 'avatar']  
        for key in data.keys():  
            if key not in all_keys:  
                err['extra_key'] = 'Make sure there are no extra fields.'  
                break  
            if data[key]:  
                clean_data[key] = data[key]
        
        data = clean_data

        #Do passwords match given both are present  
        inter = list(set(['password', 'repeat_password']) & set(data.keys()))  
        if len(inter) == 2:  
            if data['password'] != data['repeat_password']:  
                if 'password' in err.keys():  
                    err['password'].append('Passwords do not match.')  
                else:  
                    err['password'] = ['Passwords do not match.']  
        elif len(inter) == 1:  
            err['password'] = ['Remember to use both password fields or none.']  
          
        #Does the phone number have correct formatting  
        if 'phone_num' in data.keys():  
            try:  
                validate_international_phonenumber(data['phone_num'])  
            except:  
                if 'phone_num' in err.keys() and err['phone_num']:  
                    err['phone_num'].append('The phone number is not valid. Example format: +12125552368')  
                else:  
                    err['phone_num'] = ['The phone number is not valid. Example format: +12125552368']  
          
        if 'email' in data.keys() and 'email' not in err.keys():  
            if Account.objects.filter(email=data['email']).exists():  
                err['email'] = 'This email is taken.'  
        if 'phone_num' in data.keys() and 'phone_num' not in err.keys():  
            if Account.objects.filter(phone_num=data['phone_num']).exists():  
                err['phone_num'] = 'This phone number is taken.'  
  
        #Raise errors if any  
        if err:  
            raise serializers.ValidationError(err)  
          
        if 'repeat_password' in data.keys():  
            data.pop('repeat_password')  
        return data  
  
    def save(self, validated_data, account):  
        for key in validated_data:  
            if key != 'password' and validated_data[key]:  
                setattr(account, key, validated_data[key])  
        if 'password' in validated_data.keys():  
            account.set_password(validated_data['password'])  
        account.save()  
        return account  

class DetailAccountSerializer(ParentAccountSerializer, serializers.ModelSerializer):  
    # API - Serialize the account with edits off, show info  
    
    def serialize(self, account):  
        try:
            payment_info = PaymentInfoSerializer.serialize(account.payment_info.get())
        except:
            payment_info = None
        try:
            sub = SubscriptionSerializer.serialize(account.sub.get())
        except:
            sub = None
        json_data = {'email': account.email,  
                'first_name': account.first_name,  
                'last_name': account.last_name,  
                'phone_num': str(account.phone_num),  
                'avatar': account.avatar.url,
                'payment_info': payment_info,
                'subscription': sub,
        }
        return json_data  

class SubscriptionTypeSerializer(serializers.ModelSerializer):  
    class Meta:
        model = SubscriptionType
        fields = ['type', 'amount']
    def serialize(self, subscription_type):  
        json_data = {'type': subscription_type.type,  
                'amount': subscription_type.amount
        }
        return json_data  

