import { Toaster } from 'react-hot-toast';

const ToastConfig = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: '!bg-dark-surface !text-gray-100 !border !border-dark-border !backdrop-blur-md',
        style: {
          background: 'rgba(255, 255, 255, 0.05)',
          color: '#f3f4f6',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        success: {
          iconTheme: {
            primary: '#22C55E',
            secondary: '#0A0F1A',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: '#0A0F1A',
          },
        },
      }}
    />
  );
};

export default ToastConfig;
