!macro customInstall
  DetailPrint "Register BilldDesk URI Handler"
  DeleteRegKey HKCR "BilldDesk"
  WriteRegStr HKCR "BilldDesk" "" "URL:BilldDesk"
  WriteRegStr HKCR "BilldDesk" "URL Protocol" ""
  WriteRegStr HKCR "BilldDesk\shell" "" ""
  WriteRegStr HKCR "BilldDesk\shell\Open" "" ""
  WriteRegStr HKCR "BilldDesk\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend
