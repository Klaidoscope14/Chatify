import { Users } from "lucide-react"; // Import the Users icon from Lucide React

const SidebarSkeleton = () => {
  // Create an array with 8 empty elements for skeleton placeholders
  const skeletonContacts = Array(8).fill(null);

  return (
    // Sidebar container with responsive width, border, and transition effects
    <aside
      className="h-full w-20 lg:w-72 border-r border-base-300 
    flex flex-col transition-all duration-200"
    >
      {/* Sidebar Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          {/* Users icon */}
          <Users className="w-6 h-6" />
          {/* "Contacts" label (hidden on small screens) */}
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      {/* Skeleton Contacts List */}
      <div className="overflow-y-auto w-full py-3">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p-3 flex items-center gap-3">
            {/* Avatar skeleton (circular) */}
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-12 rounded-full" />
            </div>

            {/* User info skeleton - visible only on larger screens */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              {/* Placeholder for contact name */}
              <div className="skeleton h-4 w-32 mb-2" />
              {/* Placeholder for last message preview */}
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;