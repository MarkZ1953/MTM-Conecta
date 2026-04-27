import type { Button as ButtonType } from "primereact/button";
import { StyleClass } from "primereact/styleclass";
import React, { useState, useRef } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Ripple } from "primereact/ripple";
import { UIDialog } from "./components";
import FormAutoCompleteMultiple from "./components/form/form-autocomplete-multiple";
import { LoginPage } from "./auth/pages/login-page";
import { RegisterPage } from "./auth/pages/register-page";

type View = "login" | "register" | "app";

export default function App() {
  const [view, setView] = useState<View>("login");
  const [visible, setVisible] = useState<boolean>(false);
  const btnRef1 = useRef<any>(null);
  const btnRef2 = useRef<any>(null);
  const btnRef3 = useRef<any>(null);
  const btnRef4 = useRef<any>(null);

  // --- Vistas de autenticación ---
  if (view === "login") {
    return (
      <LoginPage
        onNavigateRegister={() => setView("register")}
        onLoginSuccess={() => setView("app")}
      />
    );
  }
  if (view === "register") {
    return (
      <RegisterPage
        onNavigateLogin={() => setView("login")}
        onRegisterSuccess={() => setView("login")}
      />
    );
  }

  return (
    <div className="card flex justify-content-center">
      <Sidebar
        visible={visible}
        onHide={() => setVisible(false)}
        content={({ closeIconRef, hide }) => (
          <div
            id="app-sidebar-2"
            className="surface-section h-screen flex flex-column"
            style={{ width: "310px" }}
          >
            <div className="flex flex-column h-full">
              {/* Header */}
              <div className="flex align-items-center justify-content-between px-4 pt-3 shrink-0">
                <span className="inline-flex align-items-center gap-2">
                  <span className="font-semibold text-2xl text-primary">
                    Your Logo
                  </span>
                </span>
                <Button
                  type="button"
                  ref={closeIconRef as React.Ref<ButtonType>}
                  onClick={(e) => hide(e)}
                  icon="pi pi-times"
                  rounded
                  outlined
                  className="h-2rem w-2rem"
                />
              </div>

              {/* Menu */}
              <div className="overflow-y-auto">
                {/* Sección FAVORITES */}
                <ul className="list-none pt-3 px-3 m-0">
                  <li>
                    {/* Título de sección — dispara el toggle del ul de abajo */}
                    <StyleClass
                      nodeRef={btnRef1}
                      selector="@next"
                      enterFromClassName="hidden"
                      enterActiveClassName="slidedown"
                      leaveToClassName="hidden"
                      leaveActiveClassName="slideup"
                    >
                      <div
                        ref={btnRef1}
                        className="p-ripple p-3 flex align-items-center justify-content-between text-600 cursor-pointer"
                      >
                        <span className="font-medium">FAVORITES</span>
                        <i className="pi pi-chevron-down"></i>
                        <Ripple />
                      </div>
                    </StyleClass>

                    {/* Items de FAVORITES — empieza visible, sin hidden */}
                    <ul className="list-none p-0 m-0 overflow-hidden">
                      <li>
                        <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                          <i className="pi pi-home mr-2"></i>
                          <span className="font-medium">Dashboard</span>
                          <Ripple />
                        </a>
                      </li>
                      <li>
                        <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                          <i className="pi pi-bookmark mr-2"></i>
                          <span className="font-medium">Bookmarks</span>
                          <Ripple />
                        </a>
                      </li>

                      {/* Reports con submenu */}
                      <li>
                        <StyleClass
                          nodeRef={btnRef2}
                          selector="@next"
                          enterFromClassName="hidden"
                          enterActiveClassName="slidedown"
                          leaveToClassName="hidden"
                          leaveActiveClassName="slideup"
                        >
                          <a
                            ref={btnRef2}
                            className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                          >
                            <i className="pi pi-chart-line mr-2"></i>
                            <span className="font-medium">Reports</span>
                            <i className="pi pi-chevron-down ml-auto mr-1"></i>
                            <Ripple />
                          </a>
                        </StyleClass>
                        <ul className="list-none py-0 pl-3 pr-0 m-0 hidden overflow-hidden transition-all transition-duration-400 transition-ease-in-out">
                          <li>
                            <StyleClass
                              nodeRef={btnRef3}
                              selector="@next"
                              enterFromClassName="hidden"
                              enterActiveClassName="slidedown"
                              leaveToClassName="hidden"
                              leaveActiveClassName="slideup"
                            >
                              <a
                                ref={btnRef3}
                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                              >
                                <i className="pi pi-chart-line mr-2"></i>
                                <span className="font-medium">Revenue</span>
                                <i className="pi pi-chevron-down ml-auto mr-1"></i>
                                <Ripple />
                              </a>
                            </StyleClass>
                            <ul className="list-none py-0 pl-3 pr-0 m-0 hidden overflow-hidden transition-all transition-duration-400 transition-ease-in-out">
                              <li>
                                <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                  <i className="pi pi-table mr-2"></i>
                                  <span className="font-medium">View</span>
                                  <Ripple />
                                </a>
                              </li>
                              <li>
                                <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                  <i className="pi pi-search mr-2"></i>
                                  <span className="font-medium">Search</span>
                                  <Ripple />
                                </a>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                              <i className="pi pi-chart-line mr-2"></i>
                              <span className="font-medium">Expenses</span>
                              <Ripple />
                            </a>
                          </li>
                        </ul>
                      </li>

                      <li>
                        <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                          <i className="pi pi-users mr-2"></i>
                          <span className="font-medium">Team</span>
                          <Ripple />
                        </a>
                      </li>
                      <li>
                        <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                          <i className="pi pi-comments mr-2"></i>
                          <span className="font-medium">Messages</span>
                          <span
                            className="inline-flex align-items-center justify-content-center ml-auto bg-blue-500 text-0 border-circle"
                            style={{ minWidth: "1.5rem", height: "1.5rem" }}
                          >
                            3
                          </span>
                          <Ripple />
                        </a>
                      </li>
                      <li>
                        <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                          <i className="pi pi-calendar mr-2"></i>
                          <span className="font-medium">Calendar</span>
                          <Ripple />
                        </a>
                      </li>
                      <li>
                        <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                          <i className="pi pi-cog mr-2"></i>
                          <span className="font-medium">Settings</span>
                          <Ripple />
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>

                {/* Sección APPLICATION */}
                <ul className="list-none px-3 py-1 m-0">
                  <li>
                    <StyleClass
                      nodeRef={btnRef4}
                      selector="@next"
                      enterFromClassName="hidden"
                      enterActiveClassName="slidedown"
                      leaveToClassName="hidden"
                      leaveActiveClassName="slideup"
                    >
                      <div
                        ref={btnRef4}
                        className="p-ripple p-3 flex align-items-center justify-content-between text-600 cursor-pointer"
                      >
                        <span className="font-medium">APPLICATION</span>
                        <i className="pi pi-chevron-down"></i>
                        <Ripple />
                      </div>
                    </StyleClass>

                    {/* Items de APPLICATION — empieza visible, sin hidden */}
                    <ul className="list-none p-0 m-0 overflow-hidden">
                      <li>
                        <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                          <i className="pi pi-folder mr-2"></i>
                          <span className="font-medium">Projects</span>
                          <Ripple />
                        </a>
                      </li>
                      <li>
                        <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                          <i className="pi pi-chart-bar mr-2"></i>
                          <span className="font-medium">Performance</span>
                          <Ripple />
                        </a>
                      </li>
                      <li>
                        <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                          <i className="pi pi-cog mr-2"></i>
                          <span className="font-medium">Settings</span>
                          <Ripple />
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              {/* Footer */}
              <div className="mt-auto">
                <hr className="mb-3 mx-3 border-top-1 border-none surface-border" />
                <a className="m-3 flex align-items-center cursor-pointer p-3 gap-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                  <Avatar
                    image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                    shape="circle"
                  />
                  <span className="font-bold">Amy Elsner</span>
                </a>
              </div>
            </div>
          </div>
        )}
      />

      <UIDialog>
        <p className="m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <FormAutoCompleteMultiple />
      </UIDialog>
    </div>
  );
}
