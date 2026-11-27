import ResourceManager from '@/components/admin/ResourceManager';
export default function Page() {
  return <ResourceManager table="car_types" title="Car types and rates" orderBy="sort" slugFrom="name_en" addLabel="Add car type"
    hint="Change the per-km rate here and every fare on the website updates. Turn Active off to hide a car."
    defaults={{ active: true, sort: 0, rate_per_km: 0, min_km_per_day: 250, night_halt: 0, waiting_per_hour: 0, models: '', seats: '', name_hi: '', image_url: '' }}
    columns={['name_en', 'seats', 'rate_per_km', 'min_km_per_day', 'active']}
    fields={[
      { key: 'name_en', label: 'Name (English)', type: 'text' }, { key: 'name_hi', label: 'Name (Hindi)', type: 'text' },
      { key: 'models', label: 'Example models', type: 'text' }, { key: 'seats', label: 'Seats text (e.g. 4 + driver)', type: 'text' },
      { key: 'rate_per_km', label: 'Rate per km (₹)', type: 'number' }, { key: 'min_km_per_day', label: 'Minimum km per day', type: 'number' },
      { key: 'night_halt', label: 'Night halt charge (₹)', type: 'number' }, { key: 'waiting_per_hour', label: 'Waiting per hour (₹)', type: 'number' },
      { key: 'image_url', label: 'Photo', type: 'image' }, { key: 'sort', label: 'Order (small number shows first)', type: 'number' },
      { key: 'active', label: 'Active (show on website)', type: 'bool' },
    ]} />;
}
