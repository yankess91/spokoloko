FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY BraiderskiReservation.sln ./
COPY BraiderskiReservation.Api/BraiderskiReservation.Api.csproj BraiderskiReservation.Api/
COPY BraiderskiReservation.Domain/BraiderskiReservation.Domain.csproj BraiderskiReservation.Domain/
COPY BraiderskiReservation.Infrastructure/BraiderskiReservation.Infrastructure.csproj BraiderskiReservation.Infrastructure/
RUN dotnet restore BraiderskiReservation.sln
COPY BraiderskiReservation.Api/ BraiderskiReservation.Api/
COPY BraiderskiReservation.Domain/ BraiderskiReservation.Domain/
COPY BraiderskiReservation.Infrastructure/ BraiderskiReservation.Infrastructure/
WORKDIR /src/BraiderskiReservation.Api
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "BraiderskiReservation.Api.dll"]
