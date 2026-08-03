import { IconInbox } from "@tabler/icons-react";

type EmptyStateProps = {
  title: string;
  description?: string;
};

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <IconInbox size={48} className="empty-state-icon" />
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
