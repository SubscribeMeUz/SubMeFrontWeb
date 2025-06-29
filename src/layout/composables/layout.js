import { reactive, computed, readonly } from 'vue';

// Load saved configuration from localStorage or use defaults
function loadLayoutConfig() {
    const savedConfig = localStorage.getItem('layoutConfig');
    return savedConfig
        ? JSON.parse(savedConfig)
        : {
              preset: 'Aura',
              primary: 'emerald',
              surface: null,
              darkTheme: true, // Default to dark mode if not set
              menuMode: 'static'
          };
}

// Store layout config to localStorage whenever it's updated
function saveLayoutConfig() {
    localStorage.setItem('layoutConfig', JSON.stringify(layoutConfig));
}

const layoutConfig = reactive(loadLayoutConfig());

const layoutState = reactive({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    activeMenuItem: null
});

export function useLayout() {
    const setPrimary = (value) => {
        layoutConfig.primary = value;
        saveLayoutConfig(); // Save to localStorage
    };

    const setSurface = (value) => {
        layoutConfig.surface = value;
        saveLayoutConfig(); // Save to localStorage
    };

    const setPreset = (value) => {
        layoutConfig.preset = value;
        saveLayoutConfig(); // Save to localStorage
    };

    const setActiveMenuItem = (item) => {
        layoutState.activeMenuItem = item.value || item;
    };

    const setMenuMode = (mode) => {
        layoutConfig.menuMode = mode;
        saveLayoutConfig(); // Save to localStorage
    };

    // Toggle dark mode and save to localStorage
    const toggleDarkMode = () => {
        layoutConfig.darkTheme = !layoutConfig.darkTheme;
        document.documentElement.classList.toggle('app-dark', layoutConfig.darkTheme);
        saveLayoutConfig(); // Save to localStorage
    };

    // Ensure dark mode is enforced when app starts
    if (layoutConfig.darkTheme) {
        document.documentElement.classList.add('app-dark'); // Apply dark mode from localStorage
    } else {
        document.documentElement.classList.remove('app-dark'); // Remove dark mode
    }

    const onMenuToggle = () => {
        if (layoutConfig.menuMode === 'overlay') {
            layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
        }

        if (window.innerWidth > 991) {
            layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
        } else {
            layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
        }
    };

    const resetMenu = () => {
        layoutState.overlayMenuActive = false;
        layoutState.staticMenuMobileActive = false;
        layoutState.menuHoverActive = false;
    };

    const isSidebarActive = computed(
        () => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive
    );

    const isDarkTheme = computed(() => layoutConfig.darkTheme);

    const getPrimary = computed(() => layoutConfig.primary);

    const getSurface = computed(() => layoutConfig.surface);

    return {
        layoutConfig: readonly(layoutConfig),
        layoutState: readonly(layoutState),
        onMenuToggle,
        isSidebarActive,
        isDarkTheme,
        getPrimary,
        getSurface,
        setActiveMenuItem,
        toggleDarkMode,
        setPrimary,
        setSurface,
        setPreset,
        resetMenu,
        setMenuMode
    };
}
