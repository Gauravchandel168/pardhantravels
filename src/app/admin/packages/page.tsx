import ResourceManager from '@/components/admin/ResourceManager';
export default function Page() {
  return <ResourceManager table="packages" title="Tour packages" orderBy="sort" slugFrom="name_en" addLabel="Add package"
    hint="Car and driver packages. Leave the price empty to show 'On request'."
    defaults={{ active: true, sort: 0, nights: 0, days: 1, price_note: '', places_en: '', places_hi: '', name_hi: '', image_url: '' }}
    columns={['name_en', 'days', 'price', 'active']}
    fields={[
      { key: 'name_en', label: 'Name (English)', type: 'text' }, { key: 'name_hi', label: 'Name (Hindi)', type: 'text' },
      { key: 'days', label: 'Days', type: 'number' }, { key: 'nights', label: 'Nights', type: 'number' },
      { key: 'price', label: 'Car fare from (₹)', type: 'number' }, { key: 'price_note', label: 'Price note (e.g. Sedan)', type: 'text' },
      { key: 'places_en', label: 'Places covered (English)', type: 'textarea' }, { key: 'places_hi', label: 'Places covered (Hindi)', type: 'textarea' },
      { key: 'image_url', label: 'Photo', type: 'image' }, { key: 'sort', label: 'Order', type: 'number' },
      { key: 'active', label: 'Active (show on website)', type: 'bool' },
    ]} />;
}
