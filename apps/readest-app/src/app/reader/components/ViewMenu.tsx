import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { BiMoon, BiSun } from 'react-icons/bi';
import { MdZoomOut, MdZoomIn, MdCheck } from 'react-icons/md';

import { useReaderStore } from '@/store/readerStore';
import { getStyles } from '@/utils/style';

interface ViewMenuProps {
  bookKey: string;
  setIsDropdownOpen?: (open: boolean) => void;
  onSetSettingsDialogOpen: (open: boolean) => void;
}

const ViewMenu: React.FC<ViewMenuProps> = ({
  bookKey,
  setIsDropdownOpen,
  onSetSettingsDialogOpen,
}) => {
  const { getView, getViewSettings, setViewSettings } = useReaderStore();
  const viewSettings = getViewSettings(bookKey);

  const [isDarkMode, setDarkMode] = useState(viewSettings!.theme === 'dark');
  const [isScrolledMode, setScrolledMode] = useState(viewSettings!.scrolled);
  const [isInvertedColors, setInvertedColors] = useState(viewSettings!.invert);
  const [zoomLevel, setZoomLevel] = useState(viewSettings!.zoomLevel!);

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 200));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 50));
  const resetZoom = () => setZoomLevel(100);
  const toggleScrolledMode = () => setScrolledMode(!isScrolledMode);
  const toggleDarkMode = () => setDarkMode(!isDarkMode);
  const toggleInvertedColors = () => setInvertedColors(!isInvertedColors);

  const openFontLayoutMenu = () => {
    setIsDropdownOpen?.(false);
    onSetSettingsDialogOpen(true);
  };

  useEffect(() => {
    getView(bookKey)?.renderer.setAttribute('flow', isScrolledMode ? 'scrolled' : 'paginated');
    viewSettings!.scrolled = isScrolledMode;
    setViewSettings(bookKey, viewSettings!);
  }, [isScrolledMode]);

  useEffect(() => {
    document.body.classList.toggle('invert', isInvertedColors);
  }, [isInvertedColors]);

  useEffect(() => {
    const view = getView(bookKey);
    if (!view) return;
    // FIXME: zoom level is not working in paginated mode
    if (viewSettings?.scrolled) {
      view.renderer.setStyles?.(getStyles(viewSettings!));
    }
    viewSettings!.zoomLevel = zoomLevel;
    setViewSettings(bookKey, viewSettings!);
  }, [zoomLevel]);

  return (
    <div
      id='exclude-title-bar-mousedown'
      tabIndex={0}
      className='view-menu dropdown-content dropdown-right no-triangle z-20 mt-1 w-72 border bg-white shadow-2xl'
    >
      <div
        className={clsx(
          'flex items-center justify-between rounded-md',
          !isScrolledMode && 'text-gray-400',
        )}
      >
        <button
          onClick={zoomOut}
          className={clsx('rounded-full p-2 hover:bg-gray-100', !isScrolledMode && 'btn-disabled')}
        >
          <MdZoomOut size={20} />
        </button>
        <button
          className={clsx(
            'h-8 min-h-8 w-[50%] rounded-md p-1 text-center hover:bg-gray-100',
            !isScrolledMode && 'btn-disabled',
          )}
          onClick={resetZoom}
        >
          {zoomLevel}%
        </button>
        <button
          onClick={zoomIn}
          className={clsx('rounded-full p-2 hover:bg-gray-100', !isScrolledMode && 'btn-disabled')}
        >
          <MdZoomIn size={20} />
        </button>
      </div>

      <hr className='my-1' />

      <button
        className='flex w-full items-center justify-between rounded-md p-2 hover:bg-gray-100'
        onClick={openFontLayoutMenu}
      >
        <div className='flex items-center'>
          <span style={{ minWidth: '20px' }}></span>
          <span className='ml-2'>Font & Layout</span>
        </div>
        <span className='text-sm text-gray-400'>Shift+F</span>
      </button>

      <button
        className='flex w-full items-center justify-between rounded-md p-2 hover:bg-gray-100'
        onClick={toggleScrolledMode}
      >
        <div className='flex items-center'>
          <span style={{ minWidth: '20px' }}>
            {isScrolledMode && <MdCheck size={20} className='text-base-content' />}
          </span>
          <span className='ml-2'>Scrolled Mode</span>
        </div>
        <span className='text-sm text-gray-400'>Shift+J</span>
      </button>

      <hr className='my-1' />

      <button
        className='flex w-full items-center rounded-md p-2 hover:bg-gray-100'
        onClick={toggleDarkMode}
      >
        <div className='flex items-center'>
          <span style={{ minWidth: '20px' }}>
            {isDarkMode ? <BiMoon size={20} /> : <BiSun size={20} />}
          </span>
        </div>
        <span className='ml-2'>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
      </button>
      <button
        className={clsx(
          'flex w-full items-center justify-between rounded-md p-2 hover:bg-gray-100',
          !isDarkMode && 'btn-disabled text-gray-400',
        )}
        onClick={toggleInvertedColors}
      >
        <div className='flex items-center'>
          <span style={{ minWidth: '20px' }}>
            {isInvertedColors && <MdCheck size={20} className='text-base-content' />}
          </span>
          <span className='ml-2'>Invert Colors in Dark Mode</span>
        </div>
      </button>
    </div>
  );
};

export default ViewMenu;
