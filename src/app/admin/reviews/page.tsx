import ResourceManager from '@/components/admin/ResourceManager';
export default function Page() {
  return <ResourceManager table="reviews" title="Reviews" descending addLabel="Add review"
    hint="Only reviews set to Published appear on the website. Add real customer reviews only."
    defaults={{ rating: 5, status: 'published', source: 'Google', route: '' }}
    columns={['name', 'rating', 'text', 'status']}
    fields={[
      { key: 'name', label: 'Customer name', type: 'text' }, { key: 'rating', label: 'Rating (1-5)', type: 'number' },
      { key: 'text', label: 'Review', type: 'textarea' }, { key: 'route', label: 'Trip (e.g. Ambala to Delhi)', type: 'text' },
      { key: 'source', label: 'Source', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: ['published', 'pending', 'hidden'] },
    ]} />;
}
