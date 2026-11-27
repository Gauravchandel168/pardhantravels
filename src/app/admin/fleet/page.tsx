import ResourceManager from '@/components/admin/ResourceManager';
export default function Page() {
  return (<>
    <ResourceManager table="drivers" title="Drivers" addLabel="Add driver" hint="Licence dates within 30 days are highlighted in amber."
      defaults={{ status: 'Available', phone: '', assigned_vehicle: '' }}
      columns={['name', 'phone', 'assigned_vehicle', 'licence_expiry', 'status']}
      fields={[
        { key: 'name', label: 'Name', type: 'text' }, { key: 'phone', label: 'Phone', type: 'text' },
        { key: 'assigned_vehicle', label: 'Assigned vehicle (reg. number)', type: 'text' }, { key: 'licence_expiry', label: 'Licence expiry', type: 'date' },
        { key: 'status', label: 'Status', type: 'select', options: ['Available', 'On trip', 'Off duty'] },
      ]} />
    <ResourceManager table="vehicles" title="Vehicles" addLabel="Add vehicle" hint="Insurance, permit and fitness dates within 30 days are highlighted in amber."
      defaults={{ status: 'Available', seats: 4, model: '' }}
      columns={['reg_number', 'model', 'insurance_expiry', 'permit_expiry', 'fitness_expiry', 'status']}
      fields={[
        { key: 'reg_number', label: 'Registration number', type: 'text' }, { key: 'model', label: 'Model', type: 'text' },
        { key: 'seats', label: 'Seats', type: 'number' }, { key: 'insurance_expiry', label: 'Insurance expiry', type: 'date' },
        { key: 'permit_expiry', label: 'Permit expiry', type: 'date' }, { key: 'fitness_expiry', label: 'Fitness expiry', type: 'date' },
        { key: 'status', label: 'Status', type: 'select', options: ['Available', 'On trip', 'In service'] },
      ]} />
  </>);
}
