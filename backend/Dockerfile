FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY BraiderskiReservation.Api/BraiderskiReservation.Api.csproj BraiderskiReservation.Api/
RUN dotnet restore BraiderskiReservation.Api/BraiderskiReservation.Api.csproj
COPY BraiderskiReservation.Api/ BraiderskiReservation.Api/
WORKDIR /src/BraiderskiReservation.Api
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "BraiderskiReservation.Api.dll"]
