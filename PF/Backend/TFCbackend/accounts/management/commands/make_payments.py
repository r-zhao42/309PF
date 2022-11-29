from django.core.management.base import BaseCommand
import datetime
from dateutil.relativedelta import relativedelta
from ...models import Subscription, Payment, PaymentInfo

class Command(BaseCommand):
    help = 'Checks for payments due today'

    def handle(self, *args, **kwargs):
        queryset = Subscription.objects.all()
        for item in queryset:
            if item.next_payment_date == datetime.date.today():
                pay = PaymentInfo.objects.get(account=item.account)
                p = Payment.objects.create(account=item.account, amount=item.sub_type.amount, datetime=datetime.datetime.now(), payment_info=pay)
                p.save()
                self.stdout.write("Charged User: " + str(item.account) + " Amount: "+ str(item.sub_type.amount))

                if item.sub_type == 'monthly':
                    next_payment_date = datetime.date.today() + relativedelta(months=+1)
                else:
                    next_payment_date = datetime.date.today() + relativedelta(years=+1)

                # update next payment time
                item.next_payment_date = next_payment_date
                item.save()